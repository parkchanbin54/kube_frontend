import { atom, selector } from "recoil"
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()


export const categoryState = atom({
    key: 'category',
    default: "all"
})

export const postStatusState = atom({
    key: 'postStatus',
    default: "recruiting"
})

export const checkedItemsState = atom({
    key: 'checkedItem',
    default: [],
})

export const emailState = atom({
    key: 'emails',
    default: [],
})

export const userState = atom({
    key: 'userState',
    default: 
        {
            token: '',
            kakaoToken: '',
            kakaoRefreshToken: '',
            id: 0,
            name: '',
            profileImg: '',
            email: '',
            age: '',
            gender: '',
            isFirst: true,
            push: false,
            login: false,
        }
    ,
    effects_UNSTABLE: [persistAtom],
})