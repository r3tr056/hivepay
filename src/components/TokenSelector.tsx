import { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useRecoilState } from 'recoil';
import { CurrentTokenState } from '../atoms';
import { SHADOWS, SIZES } from '../constants/Assets';
import Colors from '../constants/Colors';
import { TOKENS } from '../constants/Dummies';
import { TChains } from '../types';

interface Props {
    defaultValue?: TChains;
    style?: StyleProp<ViewStyle>;
    dropDownContainerStyle?: StyleProp<ViewStyle>;
    onChange?: (value: TChains) => void;
}

const TOKEN_ITEMS = Object.values(TOKENS)

const TokenSelector = ({ style, defaultValue, dropDownContainerStyle, onChange }: Props) => {
    const [currentToken, setCurrentToken] = useRecoilState(CurrentTokenState);
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(defaultValue || currentToken.name);
    const [items, setItems] = useState(TOKEN_ITEMS);

    const onChangeChain = (chain: TChains) => {
        if (onChange) {
            onChange(chain);
            return;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <DropDownPicker
                multiple={false}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                props={{ onBlur: () => setOpen(false) }}
                placeholder='Select a Token'
                containerStyle={{ zIndex: 10 }}
                disableBorderRadius={false}
                labelStyle={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: SIZES.font,
                    overflow: 'hidden',
                }}
                labelProps={{ numberOfLines: 1 }}
                dropDownContainerStyle={dropDownContainerStyle}
                style={style}
                arrowIconStyle={{ opacity: 0.5 }}
                onChangeValue={(value) => onChangeChain?.(value as TChains)}
            />
        </TouchableWithoutFeedback>
    )
}

TokenSelector.defaultProps = {
    style: {
        width: "50%",
        borderRadius: 100,
        paddingRight: SIZES.p20,
        backgroundColor: Colors.gray,
        ...SHADOWS.shadow8,
    },
    dropDownContainerStyle: {
        width: "50%",
        borderWidth: 0,
        marginTop: 5,
    },
};

export default TokenSelector;