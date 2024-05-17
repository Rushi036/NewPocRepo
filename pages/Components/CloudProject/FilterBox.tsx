
function FilterBox(props:any)
{
    const {searchQuery,setSearchQuery,setCurrentPage} = props;
    return (
        <div className="mt-6">
            <input
                type="text"
                placeholder="Search..."
                className="border px-2 py-1 rounded-md"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
            />
        </div>
    )
}

export default FilterBox;