type FiltersProps = {
  minPrice: string;
  maxPrice: string;
  onChangeMinPrice: (value: string) => void;
  onChangeMaxPrice: (value: string) => void;
};

export default function Filters({
  minPrice,
  maxPrice,
  onChangeMinPrice,
  onChangeMaxPrice,
}: FiltersProps) {
  return (
    <div className='mt-8 flex gap-4 items-center'>
      <input
        type='number'
        placeholder='Min price'
        value={minPrice}
        onChange={(e) => onChangeMinPrice(e.target.value)}
        className='p-2 rounded border'
      />

      <input
        type='number'
        placeholder='Max price'
        value={maxPrice}
        onChange={(e) => onChangeMaxPrice(e.target.value)}
        className='p-2 rounded border'
      />
    </div>
  );
}
