#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 IAP 自检用的测试证书链（自签 CA + 叶子证书），输出 JSON 到 stdout。
仅用于 tools/iap-selftest.mjs —— 这些证书与本机/生产毫无关系，是现造的。
"""
import json
import base64
import datetime

from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec


def der_b64(cert):
    return base64.b64encode(cert.public_bytes(serialization.Encoding.DER)).decode()


def key_pem(key):
    return key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption(),
    ).decode()


def make(name, issuer_cert=None, issuer_key=None, not_before=None, days=365, is_ca=None, ext_oid=None):
    key = ec.generate_private_key(ec.SECP256R1())
    subject = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)])
    now = datetime.datetime.now(datetime.timezone.utc)
    nb = not_before or now
    builder = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer_cert.subject if issuer_cert else subject)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(nb)
        .not_valid_after(nb + datetime.timedelta(days=days))
        .add_extension(
            x509.BasicConstraints(ca=((issuer_cert is None) if is_ca is None else is_ca), path_length=None),
            critical=True,
        )
    )
    if ext_oid:
        builder = builder.add_extension(
            x509.UnrecognizedExtension(x509.ObjectIdentifier(ext_oid), b"\x05\x00"),
            critical=False,
        )
    cert = builder.sign(issuer_key or key, hashes.SHA256())
    return key, cert


now = datetime.datetime.now(datetime.timezone.utc)

root_key, root = make("Test Root CA - IAP selftest")
inter_key, inter = make("Test Intermediate CA - IAP selftest", issuer_cert=root, issuer_key=root_key, is_ca=True, ext_oid="1.2.840.113635.100.6.2.1")
leaf_key, leaf = make("Test Leaf - IAP selftest", issuer_cert=inter, issuer_key=inter_key, ext_oid="1.2.840.113635.100.6.11.1")
# 过期叶子：签发日往前推 400 天，有效期 30 天 ⇒ 现在已过期
exp_key, exp_leaf = make(
    "Expired Leaf - IAP selftest",
    issuer_cert=inter,
    issuer_key=inter_key,
    not_before=now - datetime.timedelta(days=400),
    days=30,
    ext_oid="1.2.840.113635.100.6.11.1",
)

print(json.dumps({
    "rootDerB64": der_b64(root),
    "interDerB64": der_b64(inter),
    "leafDerB64": der_b64(leaf),
    "leafKeyPem": key_pem(leaf_key),
    "expiredLeafDerB64": der_b64(exp_leaf),
    "expiredLeafKeyPem": key_pem(exp_key),
}))
