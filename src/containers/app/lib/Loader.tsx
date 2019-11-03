import styled from 'styled-components'
import { colorList } from '../../../utils'

export const Loader = styled.div`
	border: 4px solid rgba(0, 0, 0, 0);
	border-top: 4px solid ${colorList[0]};
	border-radius: 50%;
	width: 1.5rem;
	height: 1.5rem;
	animation: anim 1.5s linear infinite;

	@keyframes anim {
		0% { transform: rotate(0deg); }
  		100% { transform: rotate(360deg); }
	}
`
