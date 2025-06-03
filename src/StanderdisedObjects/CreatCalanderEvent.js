export default function CreatCalanderEvent(data = {}, fallback = {}) {
  const {
    no_id = 0,                  // fallback for id
    no_item_order = 0,               // fallback for item_order
    no_name = 'Type Exercise...',  // fallback for name
    no_rep_set = 'Type NxN or N...',
    no_note = '',
  } = fallback;


  const dbFns = window.db.dataBaseFns();

  return {
    /** @type {{id: number, name: String, rep_set: String, item_order: number, start: number, end: number, note: String, flags: String}} */
    data: {
      id: data.id || no_id,
      name: data.name || no_name,
      rep_set: data.rep_set || no_rep_set,
      item_order: data.item_order || no_item_order,
      start: data.start || 0,
      end: data.end || 0,
      note: data.note || no_note,
      flags: data.flags || ''
    },
    saveEvent: function (callBackFn) {
      const eventsJSON = localStorage.getItem('currentCalenderEvents');

      /** @type {{id: number, name: String, rep_set: String, item_order: number, start: number, end: number, note: String, flags: String}[]} */
      const events = eventsJSON ? JSON.parse(eventsJSON) : [];

      let newId = 1;

      if (this.data.id !== 0) {
        dbFns.updateRow({ tableName: 'events', data: this.data, where: { id: this.data.id } });
      } else {
        const existingIds = events.map(event => event.id);
        while (existingIds.includes(newId)) newId++;

        this.data.id = newId;
        this.data.item_order = events.length > 0 ? events[events.length - 1].item_order + 1 : 0;

        dbFns.insertInto({ tableName: 'events', data: this.data });
      }

      console.log(`Exercise ID saved: ${this.data.id}`);

      if (callBackFn === typeof `function`) callBackFn();
    }
  };
}
