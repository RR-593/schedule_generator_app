const fetchEvents = async (setState, setLoading) => {
  try {
    const dbFns = window.db.dataBaseFns();
    const result = await dbFns.selectAll('events','item_order');
    if (result.length > 0) {
      setState(result);
      localStorage.setItem('currentCalenderEvents', JSON.stringify(result));
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