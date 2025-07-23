import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [showPassword, setShowPassword] = useState({});
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        const isPasswordField = getControlItem.type === "password";
        const inputType = isPasswordField && showPassword[getControlItem.name] 
          ? "text" 
          : getControlItem.type;
        
        element = (
          <div className="relative w-full">
            <Input 
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={inputType}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={`custom-input ${isPasswordField ? 'pr-12' : ''}`}
              style={{ paddingRight: isPasswordField ? '3rem' : '1rem' }}
            />
            {isPasswordField && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full cursor-pointer z-10 hover:bg-gray-100 rounded-r-lg transition-colors mr-50px"
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  [getControlItem.name]: !prev[getControlItem.name]
                }))}
                tabIndex={-1}
                style={{ left: '440px', top: '3px', bottom: '1px', opacity:'70%', background: 'transparent', border: 'none', outline: 'none', color: 'gray', height: '40px' }}
              >
                {showPassword[getControlItem.name] ? (
                  <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors opacity-50 " />
                )}
              </button>
            )}
          </div>
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full custom-btn">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;