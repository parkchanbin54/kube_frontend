import React, { useEffect } from 'react'
import { useState, Fragment } from 'react'
import { useNavigate} from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ForwardIcon, TrashIcon,ClipboardDocumentIcon } from '@heroicons/react/20/solid'
import { useSelector,useDispatch } from 'react-redux';
import { ms } from 'date-fns/locale';

function Invitation(props) {
    const {invite}=props;
    
    return (
        <div className='rounded-xl'>
            <p>{invite}님이 입장했습니다!</p>
        </div>
    )
}

export default Invitation;