
import './viewStretchOrder.css'


const ViewStretchTexturesSection: React.FC<any> = ({ room }: any) => {

    return (<>
        {
            room.groupedStretchCeilings ?

                <table className="table tableSection" key={room.id}>
                    <thead>
                        <tr style={{ 
                            background: "#dfdce0" }}>
                            <th scope="col">Առաստաղ</th>
                            <th scope="col">Գին</th>
                            <th scope="col">Ք/Մ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {room.groupedStretchCeilings && Object.keys(room.groupedStretchCeilings).map((key) => {
                            if (typeof room.groupedStretchCeilings[key] === 'object' && room.groupedStretchCeilings[key] !== null) {
                                return <tr key={key}>
                                    <td>{room.groupedStretchCeilings[key].name}</td>
                                    <td>{room.groupedStretchCeilings[key].price}</td>
                                    <td>{room.groupedStretchCeilings[key].quantity}</td>
                                </tr>

                            }
                            return null;
                        })}

                    </tbody>
                </table>
                : null
        }
    </>);
};

export default ViewStretchTexturesSection;
