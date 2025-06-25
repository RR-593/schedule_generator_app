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
    no_name = 'New Training Schedule...',
    no_availablity = Array.from({ length: 7 }, (_, i) => 0),
    no_item_order = 0,
  } = fallback;

  const dbFns = window.db.dataBaseFns();

  return {
    data: {
      id: data.id || no_id,
      name: data.name || no_name,
      availablity: JSON.parse(data.availablity) || no_availablity,
      rest_length: data.rep_time || 0,
      item_order: data.item_order || no_item_order,
      flags: data.flags || ''
    },


    /**
     * Saves the Calander data to localStorage and database. If the event has an ID, it updates; otherwise, inserts a new one.
     *
     * @param {Function} [callBackFn] - Optional callback to execute after saving.
     */
    save: function (callBackFn) {
      /** 
       * @type {{
       *     id: number,
       *     name: string,
       *     availablity: Array,
       *     rest_length: number,
       *     item_order: number,
       *     flags: string
       *   }[]} 
      */

      const preparedData = {...this.data, availablity:JSON.stringify(this.data.availablity)}

      if (this.data.id !== 0) {
        dbFns.updateRow({ tableName: 'userGeneratedCalenders', data: preparedData, where: { id: this.data.id } });
      } 

      if (typeof callBackFn === 'function') callBackFn();
    }
  };
}
