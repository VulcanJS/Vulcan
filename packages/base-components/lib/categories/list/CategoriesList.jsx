import Router from "../../router.js"
import { DropdownButton, MenuItem } from 'react-bootstrap';

const CategoriesList = ({categories}) => {

  return (
    <div className="categories">
      <DropdownButton bsStyle="default" className="btn-secondary" title="Categories" id="categories-dropdown">
        <MenuItem href={Router.path("posts.list")} eventKey={0} className="dropdown-item post-category">All</MenuItem>
        {categories.map((category, index) => 
          <MenuItem 
            href={Router.extendPathWithQueryParams("posts.list", {}, {cat: category.slug})} 
            eventKey={index+1} 
            key={category._id} 
            className="dropdown-item post-category" 
          >
            {category.name}
          </MenuItem>
        )}
      </DropdownButton>
    </div>
  )
  
};

module.exports = CategoriesList;