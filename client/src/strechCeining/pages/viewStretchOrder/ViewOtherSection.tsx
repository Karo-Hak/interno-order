
const ViewOtherSection: React.FC<any> = ({ room }: any) => {


  return (<>
    {
      room.groupedOthers      ?
        < table className="table tableSection" key={room.id} >
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th >Լռացուցիչ</th>
              <th >Գին</th>
              <th >Հատ</th>
              <th >Գումար</th>
            </tr>
          </thead>
          <tbody>
            {room.groupedOthers && Object.keys(room.groupedOthers).map((key) => {
              if (typeof room.groupedOthers[key] === 'object' && room.groupedOthers[key] !== null) {
                return <tr key={key}>
                  <td>{room.groupedOthers[key].name}</td>
                  <td>{room.groupedOthers[key].price}</td>
                  <td>{room.groupedOthers[key].quantity}</td>
                  <td>{room.groupedOthers[key].sum}</td>
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

export default ViewOtherSection;
