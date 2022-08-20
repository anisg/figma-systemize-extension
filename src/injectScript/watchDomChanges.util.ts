const mutationObserverElements: {
  element: Element;
  id: string;
  observer: any;
}[] = [];

export function _watchDomChanges(
  { el, id }: { el: Element; id: string },
  config: MutationObserverInit,
  callback: (mutationRecords: MutationRecord[]) => void
) {
  const idx = mutationObserverElements.findIndex(
    (e) => e.element == el && e.id === id
  );
  if (idx != -1) {
    console.log("found duplicate", el, id);
    const existingObserver = mutationObserverElements[idx];
    existingObserver.observer.disconnect();
    mutationObserverElements.splice(idx, 1);
  }

  var observer = new MutationObserver((mutationsList) => {
    callback(mutationsList);
  });

  mutationObserverElements[id] = { element: el, id, observer };

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
  el: Element,
  eventsMap: {
    [Property in keyof EventType]: (
      option: EventType[Property],
      el: Element
    ) => void;
  }
) {
  const eventIds = Object.keys(eventsMap) as (keyof EventType)[];
  console.log("watching", el, eventIds);
  const id = eventIds.sort().join(",");

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
