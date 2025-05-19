import "./Menu.css";
import { useEffect } from 'react';
function Menu({properties,show }) {
  useEffect(() => {
  }, [properties])
  return (
      <>
          
          {
              show && 
              <div className='menuContainer'>
                      <div className="d-flex align-center justify-content-space-between">
                          <p></p>
                        <p className="text-center mb-1">List Actions</p>
                        <i onClick={properties.closeMenu} className="bi bi-plus primary d-inline-block crossButton"></i>
                      </div>
              {
                  properties.items.map((e, i) => {
                      return <>
                          <div className='menuItem' key={i} onClick={e.action}>{ e.name }</div>
                      </>
                  })
              }
            </div>
          }
    </>
  );
}
export default Menu;