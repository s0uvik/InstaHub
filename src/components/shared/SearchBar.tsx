import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-1 px-4 w-full max-w-5xl rounded-lg bg-dark-4">
      <img 
        src="/assets/icons/search.svg" 
        alt="search" 
        width={24} 
        height={24} 
      />
      <Input
        type="text"
        placeholder="Search users..."
        className="explore-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
