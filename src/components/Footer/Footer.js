import React from "react";
import logo from "../../images/lomo-removebg-preview.png";
import "./footer.scss";

import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div
            className="footer"
            style={{
                backgroundImage: `url(https://raw.githubusercontent.com/trananhtuat/react-movie/main/src/assets/footer-bg.jpg)`,
            }}
        >
            <div className="footer__content container">
                <div className="footer__content__logo">
                    <div className="logo">
                        <Link to="/" className="logo">
                            <img className="" src={logo} alt="" />
                        </Link>
                    </div>
                </div>
                <div className="footer__content__menus">
                    <div className="footer__content__menu">
                        <Link to="/">Home</Link>
                        <Link to="/">Contact us</Link>
                        <Link to="/">Term of services</Link>
                        <Link to="/">About us</Link>
                    </div>
                    <div className="footer__content__menu">
                        <Link to="/">Live</Link>
                        <Link to="/">FAQ</Link>
                        <Link to="/">Premium</Link>
                        <Link to="/">Pravacy policy</Link>
                    </div>
                    <div className="footer__content__menu">
                        <Link to="/">You must watch</Link>
                        <Link to="/">Recent release</Link>
                        <Link to="/">Top IMDB</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
