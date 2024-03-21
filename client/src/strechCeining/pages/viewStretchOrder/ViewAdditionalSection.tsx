
const ViewAdditionalSection: React.FC<any> = ({ room }: any) => {


  return (<>
    {
      room.groupedAdditionals      ?
        < table className="table tableSection" key={room.id} >
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th >Այլ Ապրանք</th>
              <th >Գին</th>
              <th >Հատ</th>
            </tr>
          </thead>
          <tbody>
            {room.groupedAdditionals && Object.keys(room.groupedAdditionals).map((key) => {
              if (typeof room.groupedAdditionals[key] === 'object' && room.groupedAdditionals[key] !== null) {
                return <tr key={key}>
                  <td>{room.groupedAdditionals[key].name}</td>
                  <td>{room.groupedAdditionals[key].price}</td>
                  <td>{room.groupedAdditionals[key].quantity}</td>
                </tr>
              }
              return null;
            })}
          </tbody>
        </table >
        : null
    }
  </>);
};

export default ViewAdditionalSection;
