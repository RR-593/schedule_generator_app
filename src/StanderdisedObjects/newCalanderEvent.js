/**
 * 
 * @returns {{
 *   data: {
 *     id: number,
 *     calender_id: number,
 *     name: string,
 *     rep_set: string,
 *     rep_time: number,
 *     set_rest: number,
 *     total_time: number,
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
    no_rep_time = 1000,
    no_set_rest = 60000,
    no_total_time = 0,
    no_note = '',
  } = fallback;

  const dbFns = window.db.dataBaseFns();

  return {
    data: {
      id: data.id || no_id,
      calender_id: 0,
      name: data.name || no_name,
      rep_set: data.rep_set || no_rep_set,
      rep_time: data.rep_time || no_rep_time,
      set_rest: data.set_rest || no_set_rest,
      total_time: data.total_time || no_total_time,
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
       *     calender_id: number,
       *     name: string,
       *     rep_set: string,
       *     rep_time: number,
       *     set_rest: number,
       *     total_time: number,
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

        let str = this.data.rep_set;

        let reps = str.match(/\d+/g)[0] || 1
        let sets = str.match(/\d+/g)[1] || 1


        // console.log(sets*1);

        this.data.total_time = (reps * this.data.rep_time * sets) + ((sets - 1) * this.data.set_rest)
        console.log(this.data.total_time);

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
