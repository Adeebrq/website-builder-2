"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { colorThemes, type ColorTheme } from "@/lib/colorThemes";

interface ColorSelectorProps {
  selectedColor: ColorTheme;
  onColorChange: (color: ColorTheme) => void;
  className?: string;
}

const ColorSelector = ({ selectedColor, onColorChange, className = "" }: ColorSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (color: ColorTheme) => {
    onColorChange(color);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-foreground mb-2">
        Theme Color
      </label>
      
      {/* Selected Color Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-background border border-border rounded-lg flex items-center justify-between hover:border-primary transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full ${colorThemes[selectedColor].preview}`}></div>
          <span className="text-foreground">{colorThemes[selectedColor].name}</span>
        </div>
        <div className="text-muted-foreground">
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Color Options Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg">
          <div className="p-2 grid grid-cols-4 gap-2">
            {(Object.keys(colorThemes) as ColorTheme[]).map((colorKey) => {
              const color = colorThemes[colorKey];
              const isSelected = selectedColor === colorKey;
              
              return (
                <button
                  key={colorKey}
                  type="button"
                  onClick={() => handleColorSelect(colorKey)}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all hover:scale-105
                    ${isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-transparent hover:border-border'
                    }
                  `}
                  title={color.name}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto ${color.preview}`}>
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* <Check className="w-4 h-4 text-white" /> */}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-center mt-1 text-muted-foreground">
                    {color.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ColorSelector;
