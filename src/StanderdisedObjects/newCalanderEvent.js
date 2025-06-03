/**
 * 
 * @returns {{
 *   data: {
 *     id: number,
 *     name: string,
 *     rep_set: string,
 *     rep_time: number,
 *     frequency: number,
 *     item_order: number,
 *     start: number,
 *     end: number,
 *     note: string,
 *     flags: string
 *   },
 *   saveEvent: (callBackFn?: Function) => void
 * }} A calendar event object with prefilled fields and a save method.
 */
export default function newCalanderEvent(data = {}, fallback = {}) {
  const {
    no_id = 0,
    no_item_order = 0,
    no_name = 'Type Exercise...',
    no_rep_set = 'Type NxN or N...',
    no_note = '',
  } = fallback;

  const dbFns = window.db.dataBaseFns();

  return {
    data: {
      id: data.id || no_id,
      name: data.name || no_name,
      rep_set: data.rep_set || no_rep_set,
      rep_time: data.rep_time || 5,
      frequency: data.frequency || 1,
      item_order: data.item_order || no_item_order,
      start: data.start || 0,
      end: data.end || 0,
      note: data.note || no_note,
      flags: data.flags || ''
    },

    /**
     * Saves the event data to localStorage and database. If the event has an ID, it updates; otherwise, inserts a new one.
     *
     * @param {Function} [callBackFn] - Optional callback to execute after saving.
     */
    saveEvent: function (callBackFn) {
      const eventsJSON = localStorage.getItem('currentCalenderEvents');

      /** 
       * @type {{
       *     id: number,
       *     name: string,
       *     rep_set: string,
       *     rep_time: number,
       *     frequency: number,
       *     item_order: number,
       *     start: number,
       *     end: number,
       *     note: string,
       *     flags: string
       *   }[]} 
      */
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

      if (typeof callBackFn === 'function') callBackFn();
    }
  };
}
