import styled from '@emotion/styled';
import { Add } from '@mui/icons-material';
import { Dialog, Stack } from '@mui/material';
import { AnimatePresence, Reorder } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Account } from '../../../../typings/accounts';
import Layout from '../../components/Layout';
import CreateAccountModal from '../../components/Modals/CreateAccount';
import { PreHeading } from '../../components/ui/Typography/BodyText';
import { Heading1 } from '../../components/ui/Typography/Headings';
import { orderedAccountsAtom, totalBalanceAtom } from '../../data/accounts';
import { totalPendingInvoices } from '../../data/invoices';
import { totalNumberOfTransaction } from '../../data/transactions';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import theme from '../../utils/theme';
import { Card } from './../../components/Card';
import DashboardContainer from './components/DashboardContainer';
import PendingInvoices from './components/PendingInvoices';
import Transactions from './components/Transactions';

const CardContainer = styled(Reorder.Item)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  button {
    margin-top: ${theme.spacing(1)};
  }
`;

const Cards = styled(Reorder.Group)`
  min-height: 7.5rem;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: ${theme.spacing(2.5)};
`;

const CreateCard = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.spacing(2)};
  height: auto;
  border: 1px dashed #fff;
  font-size: 2rem;
  transition: 300ms;

  :hover {
    color: ${theme.palette.primary.main};
    border: 1px dashed ${theme.palette.primary.main};
  }

  svg {
    font-size: 2.5rem;
  }
`;

const Lists = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: ${theme.spacing(4)};
  grid-column-gap: ${theme.spacing(4)};
`;

const Dashboard = () => {
  const config = useConfig();
  const { t } = useTranslation();

  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  const [totalBalance] = useAtom(totalBalanceAtom);
  const [totalTransactions] = useAtom(totalNumberOfTransaction);
  const [totalInvoices] = useAtom(totalPendingInvoices);

  const [, setRefreshOrder] = useState({});
  const [orderedAccounts, setOrderedAccounts] = useAtom(orderedAccountsAtom);

  const handleReOrder = (accounts: Account[]) => {
    const order = accounts?.reduce((prev, curr, index) => ({ ...prev, [curr.id]: index }), {});
    setOrderedAccounts(order);
    setRefreshOrder(order); // TODO: This would not be needed if the 'orderedAccounts' was updated. Not sure why it doesn't.
  };

  return (
    <Layout>
      <Dialog
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        maxWidth="md"
        fullWidth
        hideBackdrop
      >
        <CreateAccountModal onClose={() => setIsCreateAccountOpen(false)} />
      </Dialog>

      <Stack spacing={4}>
        <Stack>
          <PreHeading>{t('Total balance')}</PreHeading>
          <Heading1>{formatMoney(totalBalance, config)}</Heading1>
        </Stack>

        <Cards values={orderedAccounts} onReorder={handleReOrder} axis="x">
          <AnimatePresence initial={false}>
            {orderedAccounts.map((account) => (
              <CardContainer key={account.id} value={account}>
                <Card account={account} />
              </CardContainer>
            ))}
          </AnimatePresence>

          {orderedAccounts.length < 4 && (
            <CreateCard onClick={() => setIsCreateAccountOpen(true)}>
              <Add />
            </CreateCard>
          )}
        </Cards>
      </Stack>

      <Lists>
        <DashboardContainer
          title={t('Transactions')}
          total={totalTransactions}
          viewAllRoute="/transactions"
        >
          <Transactions />
        </DashboardContainer>
        <DashboardContainer
          title={t('Invoices')}
          total={totalInvoices}
          viewAllRoute="/transactions"
        >
          <PendingInvoices />
        </DashboardContainer>

        {/* <DashboardContainer title={t('Fines')} total={2} viewAllRoute="/transactions">
          <PendingInvoices />
        </DashboardContainer> */}
      </Lists>
    </Layout>
  );
};

export default Dashboard;
