
const ViewLightRingSection: React.FC<any> = ({ room }: any) => {





  return (<>
    {
      room.groupedLightRings ?
        < table className="table tableSection" key={room.id} >
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th >Լ. Օղակ</th>
              <th >Գին</th>
              <th >Հատ</th>
              <th >Գումար</th>
            </tr>
          </thead>
          <tbody>
            {room.groupedLightRings && Object.keys(room.groupedLightRings).map((key) => {
              if (typeof room.groupedLightRings[key] === 'object' && room.groupedLightRings[key] !== null) {
                return <tr key={key}>
                  <td>{room.groupedLightRings[key].name}</td>
                  <td>{room.groupedLightRings[key].price}</td>
                  <td>{room.groupedLightRings[key].quantity}</td>
                  <td>{room.groupedLightRings[key].sum}</td>
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

export default ViewLightRingSection;
