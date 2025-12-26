import { createContext, useState } from "react";

export const DateRangeContext = createContext(null);

export const DateRangeProvider = ({ children }) => {
    const now = new Date();
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(now.getFullYear(), now.getMonth(), 1),
            endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
            key: "selection"
        },
    ]);

    return (
        <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateRangeContext.Provider>
    );
};