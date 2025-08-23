import "./Menu.css";
import { useEffect } from "react";
function Menu({ properties, action, listId, show }) {
  useEffect(() => {
    console.log(properties);
  }, [properties]);
  return (
    <>
      {show && (
        <div
          className="menuContainer"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="d-flex align-center justify-content-space-between color-000">
            <p></p>
            <p className="text-center mb-1">List Actions</p>
            <i
              onClick={properties.closeMenu}
              className="bi bi-plus primary d-inline-block crossButton"
            ></i>
          </div>
          {properties.map((e, i) => {
            return (
              <>
                {e.show && (
                  <div
                    className="menuItem"
                    key={i}
                    onClick={(event) => {
                      event.stopPropagation(), action(e.type, listId);
                    }}
                  >
                    {e.name}
                  </div>
                )}
              </>
            );
          })}
        </div>
      )}
    </>
  );
}
export default Menu;
