<?php
class Student {
    public static function create($pdo, $data) {
        $stmt = $pdo->prepare("INSERT INTO students (name, email, password, phone, document_type, document_number, country, created_at, updated_at, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $now = date('Y-m-d H:i:s');
        $active = 1;
        try {
            $result = $stmt->execute([
                $data['name'], $data['email'], $data['password'], $data['phone'],
                $data['document_type'], $data['document_number'], $data['country'],
                $now, $now, $active
            ]);
            if (!$result) {
                $errorInfo = $stmt->errorInfo();
                throw new PDOException($errorInfo[2]);
            }
            return $result;
        } catch (PDOException $e) {
            throw $e;
        }
    }
    public static function findByEmail($pdo, $email) {
        $stmt = $pdo->prepare("SELECT id, name, email, password, phone, document_type, document_number, country, image_url, created_at, updated_at, active FROM students WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }
}
?>
