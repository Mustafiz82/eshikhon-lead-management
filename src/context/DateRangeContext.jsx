import { createContext, useState } from "react";

export const DateRangeContext = createContext(null);

export const DateRangeProvider = ({ children }) => {
    const now = new Date();

    // 1. Create the end date object
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    // 2. Set the time to the very end of that day (Image 2)
    lastDayOfMonth.setHours(23, 59, 59, 999);

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(now.getFullYear(), now.getMonth(), 1),
            endDate: lastDayOfMonth, // Use the variable with the adjusted time
            key: "selection"
        },
    ]);

    console.log(dateRange)

    return (
        <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateRangeContext.Provider>
    );
};