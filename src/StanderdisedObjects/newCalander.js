/**
 * Creates a new calendar event object with default or provided values.
 * Provides a method to save the object to localStorage or a database.
 *
 * @param {Partial<{
 *   id: number,
 *   name: string,
 *   availablity: string, // JSON stringified array
 *   rep_time: number,
 *   item_order: number,
 *   flags: string
 * }>} data - Initial data to populate the calendar.
 *
 * @param {Partial<{
 *   no_id: number,
 *   no_name: string,
 *   no_availablity: number[],
 *   no_item_order: number
 * }>} fallback - Fallback/default values if data fields are missing.
 *
 * @returns {{
 *   data: {
 *     id: number,
 *     name: string,
 *     availablity: number[],
 *     rest_length: number,
 *     item_order: number,
 *     flags: string
 *   },
 *   save: (callBackFn?: Function) => void
 * }}
 */
export default function newCalander(data = {}, fallback = {}) {
  const {
    no_id = 0,
    no_name = 'New Training Schedule...',
    no_availablity = Array.from({ length: 7 }, () => 0),
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
     * Saves the calendar object to the database. Updates if an ID exists, otherwise does nothing.
     *
     * @param {Function} [callBackFn] - Optional callback to execute after saving.
     */
    save: function (callBackFn) {
      const preparedData = {
        ...this.data,
        availablity: JSON.stringify(this.data.availablity),
      };

      if (this.data.id !== 0) {
        dbFns.updateRow({
          tableName: 'userGeneratedCalenders',
          data: preparedData,
          where: { id: this.data.id },
        });
      }

      if (typeof callBackFn === 'function') callBackFn();
    }
  };
}
