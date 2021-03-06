import React, { useContext } from 'react';
import styled from 'styled-components';

// components
import Block from '../ui/block';
import Subtitle from '../ui/subtitle';
import ClassWrapper from './newSession_classWrapper';
import ProcessNav, {
  ItemWrapper,
  ItemWrapperRight,
  Hint,
  ActionButton
} from '../ui/processNav';

// contexts
import { newSessionContext } from '../contexts/newSessionContext';
import { loadingContext } from '../contexts/loadingContext';

// functions
import keyGen from '../../functions/keyGen';
import { addNewSession } from '../../actions/adminActions';

const Nav = styled.div`
  margin: 3rem 0;
`;

const getMonths = (startMonth, endMonth) => {
  const total = [];
  while (endMonth >= startMonth) {
    total.push(startMonth % 12);
    startMonth = (startMonth + 1) % 12;
  }
  return total;
};

const Preview = (props) => {
  const {
    sessionSpan,
    classes,
    setClasses,
    toNextStep,
    toPrevStep
  } = useContext(newSessionContext);
  const { setLoadingBarActive } = useContext(loadingContext);

  const totalMonths = getMonths(sessionSpan.start.month, sessionSpan.end.month);

  const removeClass = (id) => {
    const newClasses = classes.filter((classInfo) => {
      return classInfo.id !== id;
    });

    setClasses(newClasses);
  };

  const handleClick = () => {
    setLoadingBarActive(true);
    addNewSession(sessionSpan, classes).then(() => {
      setLoadingBarActive(false);
      toNextStep();
    });
  };

  return (
    <Block id="newSession_preview">
      <Subtitle title="課程預覽">
        如果有特定日期不開放課程，可以在這裡移除。
      </Subtitle>
      <div className="container-fluid px-0">
        <div className="row">
          {totalMonths.map((month) => {
            const matchClasses = classes.filter((classInfo) => {
              return classInfo.date.getMonth() + 1 === month;
            });
            return (
              <div className="col-12 col-md-6" key={keyGen()}>
                <ClassWrapper
                  month={month}
                  classes={matchClasses}
                  removeClass={removeClass}
                />
              </div>
            );
          })}
        </div>
        <Nav>
          <ProcessNav>
            <ItemWrapper>
              <Hint>上一步</Hint>
              <ActionButton onClick={toPrevStep}>設定課程期間</ActionButton>
            </ItemWrapper>
            <ItemWrapperRight>
              <Hint>下一步</Hint>
              <ActionButton onClick={handleClick}>開放報名</ActionButton>
            </ItemWrapperRight>
          </ProcessNav>
        </Nav>
      </div>
    </Block>
  );
};

export default Preview;
