import React, { Component } from 'react'
import styles from '../styles/Home.module.scss';

export default function Backdrop(props) {
    return <div 
        className={styles.backdrop} 
        onClick={props.close}
    />
}