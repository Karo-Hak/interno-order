
const ViewPlintSection: React.FC<any> = ({ plint }: any) => {



  return (<>
    {
      plint && plint.length > 0 ?
        <table className="table " key={plint.id}>
          <thead>
            <tr style={{
              background: "#dfdce0",
              height: "10px"
            }}>
              <th >Աշխատանք</th>
              <th >Գին</th>
              <th >Հատ</th>
              <th >Գումար</th>
            </tr>
          </thead>
          <tbody>
            {
              plint && Object.keys(plint).map((key) => {
                if (plint !== null) {
                  return <tr style={{
                    height: "10px"
                  }}
                    key={key}>
                    <td>{plint[key].name}</td>
                    <td>{plint[key].price}</td>
                    <td>{plint[key].quantity}</td>
                    <td>{plint[key].sum}</td>
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

export default ViewPlintSection;
