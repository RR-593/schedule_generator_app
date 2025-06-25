const fetchEvents = async (setState, setLoading) => {
  try {
    const dbFns = window.db.dataBaseFns();
    // const result = await dbFns.selectAll('events','item_order');

    const calendarJSON = localStorage.getItem('activeCalendar');
    const calender_id = calendarJSON ? JSON.parse(calendarJSON).id : 1;

    const result = await dbFns.select('events', { where: `calender_id = ${calender_id}`, order: "item_order" });

    if (result !== undefined) {
      const resArr = [].concat(result)
      // console.log(resArr);
      setState(resArr);
      localStorage.setItem('currentCalenderEvents', JSON.stringify(resArr));
    } else {
      localStorage.removeItem('currentCalenderEvents');
      setState([]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

export default fetchEvents;