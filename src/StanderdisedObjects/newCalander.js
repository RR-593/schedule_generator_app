/**
 * 
 * @returns {{
 *   data: {
 *     id: number,
 *     name: string,
 *     availablity: string,
 *     rest_length: number,
 *     item_order: number,
 *     flags: string
 *   },
 *   saveEvent: (callBackFn?: Function) => void
 * }} A calendar event object with prefilled fields and a save method.
 */
export default function newCalander(data = {}, fallback = {}) {
  const {
    no_id = 0,
    no_name = 'Type Exercise...',
    no_item_order = 0,
  } = fallback;

  const dbFns = window.db.dataBaseFns();

  return {
    data: {
      id: data.id || no_id,
      name: data.name || no_name,
      availablity: data.availablity || '',
      rest_length: data.rep_time || 0,
      item_order: data.item_order || no_item_order,
      flags: data.flags || ''
    },

    /**
     * Saves the event data to localStorage and database. If the event has an ID, it updates; otherwise, inserts a new one.
     *
     * @param {Function} [callBackFn] - Optional callback to execute after saving.
     */
    saveEvent: function (callBackFn) {
      const eventsJSON = localStorage.getItem('currentCalender');

      /** 
       * @type {{
       *     id: number,
       *     name: string,
       *     availablity: string,
       *     rest_length: number,
       *     item_order: number,
       *     flags: string
       *   }[]} 
      */
      const calendars = eventsJSON ? JSON.parse(eventsJSON) : [];

      let newId = 1;

      if (this.data.id !== 0) {
        dbFns.updateRow({ tableName: 'userGeneratedCalenders', data: this.data, where: { id: this.data.id } });
      } else {
        const existingIds = calendars.map(calendar => calendar.id);
        while (existingIds.includes(newId)) newId++;

        this.data.id = newId;
        this.data.item_order = calendars.length > 0 ? calendars[calendars.length - 1].item_order + 1 : 0;

        dbFns.insertInto({ tableName: 'userGeneratedCalenders', data: this.data });
      }

      console.log(`Exercise ID saved: ${this.data.id}`);

      if (typeof callBackFn === 'function') callBackFn();
    }
  };
}
