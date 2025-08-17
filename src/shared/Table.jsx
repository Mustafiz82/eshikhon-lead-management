const Table = ({ courses, config }) => {
    return (
        <div className="flex-1 p-6">
            <div className="overflow-x-auto">
                {courses.length > 0 ? (
                    <table className="table table-md table-zebra w-full">
                        <thead>
                            <tr>
                                {config.header.map((item, index) => (
                                    <th key={index}>{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, courseIndex) => (
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
                        No courses found.
                    </p>

                )}
            </div>
        </div>
    );
};

export default Table;
