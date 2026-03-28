  import React from 'react';
  import Items1Svg from '../../public/assets/svg/volunteer_activism.svg';
  import Items2Svg from '../../public/assets/svg/deployed_code.svg';
  import Items3Svg from '../../public/assets/svg/asterisk.svg';
  import Items4Svg from '../../public/assets/svg/psychiatry.svg';

  const Category = ({ data }) => {
    const categories = data?.category?.items || [
      { id: '1', title: 'Hand Made', description: 'Carefully crafted by hand with attention to fine detail, ensuring every piece is unique.', icon: 'icon1' },
      { id: '2', title: 'Premium Materials', description: 'We use high-quality wax, resin, and plaster for durability, safety, and refined finish.', icon: 'icon2' },
      { id: '3', title: 'Modern Design', description: 'We use high-quality wax, resin, and plaster for durability, safety, and refined finish.', icon: 'icon3' },
      { id: '4', title: 'Eco Conscious', description: 'Thoughtfully sourced materials and responsible production practices.', icon: 'icon4' },
    ];

    const getIcon = (iconId) => {
      const icons = {
        icon1: Items1Svg,
        icon2: Items2Svg,
        icon3: Items3Svg,
        icon4: Items4Svg,
      };
      return icons[iconId] || Items1Svg;
    };

    return (
      <div className='Category-Group'>
        {categories.map((category) => (
          <div key={category.id} className="CategoryItem">
            <img src={getIcon(category.icon)} alt={category.title} />
            <h2>{category.title}</h2>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    );
  };

  export default Category;