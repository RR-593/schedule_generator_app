export function createNewEvent(data = {}, fallback = {}) {
  const {
    newId = Date.now(),         // fallback for id
    newOrder = 0,               // fallback for item_order
    eTitle = 'Untitled Event',  // fallback for name
    eRepSet = '',               // fallback for rep_set
  } = fallback;

  return {
    id: data.id || newId,
    name: data.name || eTitle,
    rep_set: data.rep_set || eRepSet,
    item_order: data.item_order || newOrder,
    start: data.start || 0,
    end: data.end || 0,
    note: data.note || '',
    flags: data.flags || ''
  };
}
