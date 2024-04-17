import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { CurrentTokenState } from '../atoms';

const HomeHero = () => {
    const [showAmount, setShowAmount] = useState<boolean>(false);
    const currentToken = useRecoilValue(CurrentTokenState);

    const navigation = useNavigation();

    const onToggleAmount = () => {
        setShowAmount((state) => !state);
    }
}