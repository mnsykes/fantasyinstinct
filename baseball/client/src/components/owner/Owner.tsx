import useFetchOwners from "../../hooks/OwnerHooks";

const OwnerList = () => {
    const { data, status, isSuccess } = useFetchOwners();

    return (
        <>
            <div className="row mb-2">
                <h5 className="text-center">Owners</h5>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                </tr>
                </thead>
                <tbody>
                {data && data.map((owner) => (
                    <tr key={owner.ownerId}>
                        <td>{owner.firstName}</td>
                        <td>{owner.lastName}</td>
                        <td>{owner.email}</td>
                        <td>{owner.admin}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default OwnerList;