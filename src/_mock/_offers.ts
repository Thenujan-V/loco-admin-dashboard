import { _mock } from './_mock';

export const _offers = [...Array(10)].map((_, index) => {
  const isEven = index % 2 === 0;
  return {
    id: _mock.id(index),
    icon: _mock.image.product(index), // Use product image for offer box
    offerName: isEven ? 'Offer Lite' : 'Offer Max',
    mplanCode: 'SUN_MPLAN_001',
    operator: isEven ? 'Tata Play' : 'Sun Direct',
    status: 'Active' as 'Active' | 'Inactive',
  };
});
