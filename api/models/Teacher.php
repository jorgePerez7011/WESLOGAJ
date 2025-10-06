<?php
class Teacher {
    public static function create($pdo, $data) {
        $stmt = $pdo->prepare("INSERT INTO teachers (name, email, password, phone, document_type, document_number, country, created_at, updated_at, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $now = date('Y-m-d H:i:s');
        $active = 1;
        return $stmt->execute([
            $data['name'], $data['email'], $data['password'], $data['phone'],
            $data['document_type'], $data['document_number'], $data['country'],
            $now, $now, $active
        ]);
    }
    public static function findByEmail($pdo, $email) {
        $stmt = $pdo->prepare("SELECT * FROM teachers WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }
}
?>
