const Table = ({ data, config , dataType , width=""}) => {
    return (
        <div className="flex-1 h-[calc(100vh-120px)] overflow-auto pt-0 p-2 lg:pt-0 lg:p-6">
            <div className="overflow-x-auto lg:overflow-visible">
                {data.length > 0 ? (
                    <table style={{minWidth : width}} className="table   table-pin-rows  w-full">
                        <thead>
                            <tr className="">
                                {config.header.map((item, index) => (
                                    <th className={index == (config.header.length - 1) &&  "text-right"} key={index}>{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="!max-h-[calc(100vh-160px)]  !overflow-hidden">
                            {data.map((course, courseIndex) => (
                                <tr key={courseIndex}>
                                    {config.body.map((item, cellIndex) =>
                                        typeof item === "string" ? (
                                            <td key={cellIndex}>{course[item]}</td>
                                        ) : (
                                            <td key={cellIndex}>{item(course)}</td>
                                        )
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center mt-20 text-gray-400">
                        No {dataType || "data"} found.
                    </p>

                )}
            </div>
        </div>
    );
};

export default Table;
