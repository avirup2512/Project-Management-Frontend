import Select from 'react-select'

function Filter({ filter, item }) {
    
  return (
      <>
        <div className='row'>
            <div className='col-md-12'>
                <div className='d-flex align-center justify-content-space-between'>
                      <p>Filter</p>
                      <div classNames="mr-auto">
                          <Select onChange={filter}
                            name="List"
                            options={item}
                            className="basic-multi-select"
                            classNamePrefix="select"></Select>
                      </div>
                        
                </div>
            </div>
          </div>
          <hr></hr>
    </>
  );
}

export default Filter;