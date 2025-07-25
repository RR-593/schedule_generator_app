import newCalander from "./newCalander";

const fetchCalender = async (setState, setLoading, id = 1) => {
  try {
    const dbFns = window.db.dataBaseFns();
    const result = await dbFns.select('userGeneratedCalenders',{cols:"*",where:`id = ${id}`,query: "LIMIT 1"});
    // console.log(result);
    if (result.length > 0) {
      setState(newCalander(result[0]));
      localStorage.setItem('activeCalendar', JSON.stringify(result[0]));
    } else {
      localStorage.removeItem('activeCalendar');
      setState(newCalander());
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

export default fetchCalender;