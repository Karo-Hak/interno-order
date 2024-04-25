
const ViewBardutyunSection: React.FC<any> = ({ room }: any) => {



  return (<>
    {
      room.groupedBardutyuns      ?
        < table className="table tableSection" key={room.id} >
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th >Բարդություն</th>
              <th >Գին</th>
              <th >Հատ</th>
              <th >Գումար</th>
            </tr>
          </thead>
          <tbody>
            {room.groupedBardutyuns && Object.keys(room.groupedBardutyuns).map((key) => {
              if (typeof room.groupedBardutyuns[key] === 'object' && room.groupedBardutyuns[key] !== null) {
                return <tr key={key}>
                  <td>{room.groupedBardutyuns[key].name}</td>
                  <td>{room.groupedBardutyuns[key].price}</td>
                  <td>{room.groupedBardutyuns[key].quantity}</td>
                  <td>{room.groupedBardutyuns[key].sum}</td>
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

export default ViewBardutyunSection;
