const Table = ({ courses, courseConfig }) => {


    return <div className="flex-1 p-6">
        <div className="overflow-x-auto">
            <table className="table table-md table-zebra w-full">
                <thead>
                    <tr>
                        {
                            courseConfig.header.map(item => <th key={item} >{item}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {courses.length > 0 ? (
                        courses.map((course) => (

                            < tr >
                                {courseConfig.body.map(item => typeof item === "string" ? <td>{course[item]}</td> : item(course))}

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center text-gray-400">
                                No courses found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div >
};

export default Table;