import { disk_abi, material_abi } from '@/abi';
import { DISK_ADDRESS, MATERIAL_ADDRESS } from '@/config';
import { useEffect, useMemo, useState } from 'react';
import { hardhat } from 'viem/chains';
import { useAccount, useConnect, useContractEvent, useContractWrite, useDisconnect, usePrepareContractWrite } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import styles from './Event.module.css';
/*
To-Do
1. Wallet 연결 -> Metamask만 진행
2. Button을 이용한 Contract Write 실행
3. Event에 따른 Console로 내용 확인
4. Contract에서 발생한 Event를 Catch했을때 상태값 변화에 따른 UI 변경
*/

function Event() {
  const { address, connector: activeConnector, isConnected } = useAccount();
  const { connect } = useConnect();
  const [mint, setMint] = useState(0);
  const [test, setTest] = useState(0);
  const [testOver, setTestOver] = useState(0);
  const { disconnect } = useDisconnect();
  const metamaskConnector =
    new MetaMaskConnector({
      chains: [hardhat]
    });
  
  const [num, setNum] = useState(0);
  useContractEvent({
    address: MATERIAL_ADDRESS,
    abi: material_abi,
    eventName: 'Mint',
    listener(log) {
      console.log(log);
      setMint(mint + 1);
    }
  });
  useContractEvent({
    address: DISK_ADDRESS,
    abi: disk_abi,
    eventName: 'Test',
    listener(log) {
      console.log(log);
      setTest(test + 1);
    }
  });
  useContractEvent({
    address: DISK_ADDRESS,
    abi: disk_abi,
    eventName: 'TestOver',
    listener(log) {
      console.log(log);
      setTestOver(testOver + 1);
    }
  });

  const { config, error } = usePrepareContractWrite({
    address: DISK_ADDRESS,
    abi: disk_abi,
    functionName: 'test'
  });

  const { write } = useContractWrite(config);

  useEffect(() => {
    console.log("MINT: ", mint);
  }, [mint]);
  useEffect(() => {
    console.log("TEST: ", test);
  }, [test]);
  useEffect(() => {
    console.log("TESTOVER: ", testOver);
  }, [testOver]);
  
  return (
    <div className={styles.container}>
      <button onClick={isConnected ? () => { disconnect(); } : () => {connect({connector: metamaskConnector}) }}>
        {isConnected? "disconnect" :"connect"}
      </button>
      <p className={styles.text}>
        User: {address}
      </p>
      <button className={styles.btn} onClick={() => write?.()}>
        test
      </button>
    </div>
  )
}

export default Event;
