import { createContext } from "react";

export const AppContext= createContext()

const AppContextProvider=(props)=>{
  const currency="$"
  const calculateAge=(dob)=>{
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age
  }
  const months = [
      " ",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    const slotDate = (slotDate) => {
      const date_array = slotDate.split("_");
      return (
        date_array[0] + " " + months[Number(date_array[1])] + " " + date_array[2]
      );
    };
  
    const value={
      calculateAge,slotDate,currency
    }
    return(
          <AppContext.Provider value={value}>
            {props.children}
          </AppContext.Provider>  
    )
}
export default AppContextProvider