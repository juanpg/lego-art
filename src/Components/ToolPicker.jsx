import { useContext } from 'react'
import { Menu, IconButton, MenuList, MenuItem, MenuButton } from '@chakra-ui/react'
import { LegoArtContext } from '../Context/LegoArtContext'

export default function ToolPicker({...props}) {
  const { tools, currentTool, onToolChange } = useContext(LegoArtContext);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label={`Current tool: ${tools[currentTool].label}`}
        title={tools[currentTool].label}
        icon={tools[currentTool].icon}
        {...props}
      />
      <MenuList>
        {Object.entries(tools).map(([tool, {icon, label}]) => (
          <MenuItem 
            key={tool} 
            icon={icon}
            onClick={() => onToolChange(tool)}
          >
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}