
const ViewWorkSection: React.FC<any> = ({ works }: any) => {



  return (<>
    {
      works && works.length > 0 ?
        <table className="table " key={works.id}>
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
              works && Object.keys(works).map((key) => {
                if (works !== null) {
                  return <tr style={{
                    height: "10px"
                  }}
                    key={key}>
                    <td>{works[key].name}</td>
                    <td>{works[key].price}</td>
                    <td>{works[key].quantity}</td>
                    <td>{works[key].sum}</td>
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

export default ViewWorkSection;
