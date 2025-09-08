const Table = ({ data, config , dataType }) => {
    return (
        <div className="flex-1 h-screen overflow-auto  p-6">
            <div className="overflow-x-auto">
                {data.length > 0 ? (
                    <table className="table table-pin-rows table-pin-cols  w-full">
                        <thead>
                            <tr>
                                {config.header.map((item, index) => (
                                    <th key={index}>{item}</th>
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
