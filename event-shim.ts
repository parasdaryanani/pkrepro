import { Event, EventTarget } from 'event-target-shim';

if (!globalThis.Event) {
  globalThis.Event = Event as any;
}
if (!globalThis.EventTarget) {
  globalThis.EventTarget = EventTarget as any;
}
