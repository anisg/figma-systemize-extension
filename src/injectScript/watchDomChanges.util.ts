const mutationObserverElementsMap: Record<
  string,
  {
    element: Element;
    id: string;
    observer: any;
  }
> = {};

export function _watchDomChanges(
  { el, id }: { el: Element; id: string },
  config: MutationObserverInit,
  callback: (mutationRecords: MutationRecord[]) => void
) {
  if (id in mutationObserverElementsMap) {
    const existingObserver = mutationObserverElementsMap[id];
    console.log("found duplicate", id);
    existingObserver.observer.disconnect();
    delete mutationObserverElementsMap[id];
  }

  var observer = new MutationObserver((mutationsList) => {
    callback(mutationsList);
  });

  mutationObserverElementsMap[id] = { element: el, id, observer };

  observer.observe(el, config);
}

type WithId<Type> = {
  [Property in keyof Type]: Type[Property] & { id: Property };
};

type EventType = {
  ["updated-attribute"]: {
    attributeName;
    oldAttributeValue;
  };
};

function determineConfigGivenEvents(
  eventIds: (keyof EventType)[]
): MutationObserverInit {
  return {
    attributes: eventIds.some((e) => ["updated-attribute"].includes(e)),
    childList: false,
    subtree: false,
  };
}

export function watchDomChanges(
  id: string,
  el: Element,
  eventsMap: {
    [Property in keyof EventType]: (
      option: EventType[Property],
      el: Element
    ) => void;
  }
) {
  const eventIds = Object.keys(eventsMap) as (keyof EventType)[];

  _watchDomChanges(
    { el, id },
    determineConfigGivenEvents(eventIds),
    (mutationsList) => {
      mutationsList.forEach((mutation) => {
        if ("updated-attribute" in eventsMap) {
          mutation.type == "attributes" &&
            mutation.target == el &&
            eventsMap["updated-attribute"](
              {
                attributeName: mutation.attributeName,
                oldAttributeValue: mutation.oldValue,
              },
              mutation.target as Element
            );
        }
      });
    }
  );
}
