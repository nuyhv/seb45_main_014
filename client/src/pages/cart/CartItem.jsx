import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import CheckBox from '../../components/cart/Checkbox.jsx';
import { useState } from 'react';
import DeleteModal from './SubmitModal.jsx';
import { ReactComponent as Delete } from '../../assets/images/closebutton.svg';
import { useCartItemStore } from '../../store/store.js';
import { useCartApi } from '../../api/cart.js';

const ItemCard = styled.li`
  display: flex;
  width: 100%;
  position: relative;
  align-items: center;
  padding: 20px 0;
`;

const ItemImg = styled(Link)`
  display: block;
  width: 80px;
  height: 78px;
  margin-right: 20px;
  // 여기에 Menu 이미지가 오면 될듯?
  background: ${(props) =>
    props.img ||
    `url('https://img-cf.kurly.com/shop/data/goods/1653036991865l0.jpeg')`};
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`;

const ButtonBox = styled.div`
  display: inline-flex;
  align-items: center;
  width: 88px;
  border: 1px solid rgb(221, 223, 225);
  border-radius: 3px;
  button {
    width: 28px;
    height: 28px;
    border: none;
    background: none;
    font-size: 20px;
    &:disabled {
      color: rgb(156, 163, 175);
    }
  }
  div {
    display: inline-flex;
    font-size: 14px;
    font-weight: 400;
    width: 31px;
    height: 28px;
    line-height: 28px;
    justify-content: center;
  }
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 127px;
  text-align: right;
`;

const CartItem = ({ menuName, quantity, price, onChange, checked, id }) => {
  //-, +버튼으로 quantity를 조절하는 함수
  const [amount, setAmount] = useState(quantity);
  const { cartItem, setCartItem, storeId } = useCartItemStore();
  const { deleteCart, updateCart } = useCartApi();
  const handleDeleteCartItem = async () => {
    try {
      await deleteCart(id);
      setCartItem(cartItem.filter((item) => item.id !== id));
    } catch (e) {
      console.log(e);
    }
  };

  const quantityUp = () => {
    const updatedAmount = amount + 1;
    setAmount(updatedAmount);
    // 로컬 스토리지 업데이트
    updateQuantity(id, updatedAmount);
  };
  const quantityDown = () => {
    if (amount > 1) {
      const updatedAmount = amount - 1;
      setAmount(updatedAmount);
      // 로컬 스토리지 업데이트
      updateQuantity(id, updatedAmount);
    }
  };
  // quantity가 변화가 있을 경우 변화된 값을 axios post로 보내서 업데이트

  const updateQuantity = async (itemId, updatedQuantity) => {
    await updateCart(itemId, updatedQuantity);
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveClick = () => {
    openModal();
  };

  const handleDelete = () => {
    // 로컬 스토리지에서 삭제
  };

  return (
    <ItemCard>
      <CheckBox onChange={onChange} checked={checked} />
      <ItemImg to={`/stores/${storeId}`} />
      <div className="flex-1">
        <Link to={`/stores/${storeId}`}>
          <p>{menuName}</p>
        </Link>
      </div>
      <ButtonBox>
        <button
          type="button"
          aria-label="수량내리기"
          onClick={quantityDown}
          disabled={amount === 1}
        >
          -
        </button>
        <div>{amount}</div>
        <button type="button" aria-label="수량올리기" onClick={quantityUp}>
          +
        </button>
      </ButtonBox>
      <PriceBox>
        <span
          aria-label="판매 가격"
          data-testid="product-price"
          className="font-bold"
        >
          {(price * amount).toLocaleString()}원
        </span>
      </PriceBox>
      <button
        type="button"
        aria-label="삭제하기"
        className="pl-4"
        onClick={handleRemoveClick}
      >
        <Delete />
      </button>
      {isModalOpen && (
        <DeleteModal
          onClose={() => closeModal()}
          onSubmit={handleDelete}
          message={'정말 삭제하시겠습니까?'}
          cancelLabel={'취소'}
          submitLabel={'삭제'}
        />
      )}
    </ItemCard>
  );
};

export default CartItem;
